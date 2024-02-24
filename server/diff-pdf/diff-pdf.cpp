
#include "bmpviewer.h"
#include "gutter.h"

#include <stdio.h>
#include <assert.h>

#include <vector>

#include <glib.h>
#include <poppler.h>
#include <cairo/cairo.h>
#include <cairo/cairo-pdf.h>

#include <wx/app.h>
#include <wx/evtloop.h>
#include <wx/cmdline.h>
#include <wx/filename.h>
#include <wx/log.h>
#include <wx/frame.h>
#include <wx/sizer.h>
#include <wx/toolbar.h>
#include <wx/artprov.h>
#include <wx/progdlg.h>
#include <wx/filesys.h>

// ------------------------------------------------------------------------
// PDF rendering functions
// ------------------------------------------------------------------------

bool g_verbose = false;
bool g_skip_identical = false;
bool g_mark_differences = false;
long g_channel_tolerance = 0;
long g_per_page_pixel_tolerance = 0;
bool g_grayscale = false;
// Resolution to use for rasterization, in DPI
#define DEFAULT_RESOLUTION 300
long g_resolution = DEFAULT_RESOLUTION;

inline unsigned char to_grayscale(unsigned char r, unsigned char g, unsigned char b)
{
    return (unsigned char)(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

cairo_surface_t *render_page(PopplerPage *page)
{
    double w, h;
    poppler_page_get_size(page, &w, &h);

    const int w_px = int((int)g_resolution * w / 72.0);
    const int h_px = int((int)g_resolution * h / 72.0);

    cairo_surface_t *surface =
        cairo_image_surface_create(CAIRO_FORMAT_RGB24, w_px, h_px);

    cairo_t *cr = cairo_create(surface);

    // clear the surface to white background:
    cairo_save(cr);
    cairo_set_source_rgb(cr, 1, 1, 1);
    cairo_rectangle(cr, 0, 0, w_px, h_px);
    cairo_fill(cr);
    cairo_restore(cr);

    // Scale so that PDF output covers the whole surface. Image surface is
    // created with transformation set up so that 1 coordinate unit is 1 pixel;
    // Poppler assumes 1 unit = 1 point.
    cairo_scale(cr, (int)g_resolution / 72.0, (int)g_resolution / 72.0);

    poppler_page_render(page, cr);

    cairo_show_page(cr);

    cairo_destroy(cr);

    return surface;
}

// Creates image of differences between s1 and s2. If the offset is specified,
// then s2 is displaced by it. If thumbnail and thumbnail_width are specified,
// then a thumbnail with highlighted differences is created too.
cairo_surface_t *diff_images(int page, cairo_surface_t *s1, cairo_surface_t *s2,
                             int offset_x = 0, int offset_y = 0,
                             wxImage *thumbnail = NULL, int thumbnail_width = -1)
{
    assert(s1 || s2);

    long pixel_diff_count = 0;
    wxRect r1, r2;

    if (s1)
    {
        r1 = wxRect(0, 0,
                    cairo_image_surface_get_width(s1),
                    cairo_image_surface_get_height(s1));
    }
    if (s2)
    {
        r2 = wxRect(offset_x, offset_y,
                    cairo_image_surface_get_width(s2),
                    cairo_image_surface_get_height(s2));
    }

    // compute union rectangle starting at [0,0] position
    wxRect rdiff(r1);
    rdiff.Union(r2);
    r1.Offset(-rdiff.x, -rdiff.y);
    r2.Offset(-rdiff.x, -rdiff.y);
    rdiff.Offset(-rdiff.x, -rdiff.y);

    bool changes = false;

    cairo_surface_t *diff =
        cairo_image_surface_create(CAIRO_FORMAT_RGB24, rdiff.width, rdiff.height);

    float thumbnail_scale;
    int thumbnail_height;

    if (thumbnail)
    {
        thumbnail_scale = float(thumbnail_width) / float(rdiff.width);
        thumbnail_height = int(rdiff.height * thumbnail_scale);
        thumbnail->Create(thumbnail_width, thumbnail_height);
        // initalize the thumbnail with a white rectangle:
        thumbnail->SetRGB(wxRect(), 255, 255, 255);
    }

    // clear the surface to white background if the merged images don't fully
    // overlap:
    if (r1 != r2)
    {
        changes = true;

        cairo_t *cr = cairo_create(diff);
        cairo_set_source_rgb(cr, 1, 1, 1);
        cairo_rectangle(cr, 0, 0, rdiff.width, rdiff.height);
        cairo_fill(cr);
        cairo_destroy(cr);
    }

    const int stride1 = s1 ? cairo_image_surface_get_stride(s1) : 0;
    const int stride2 = s2 ? cairo_image_surface_get_stride(s2) : 0;
    const int stridediff = cairo_image_surface_get_stride(diff);

    const unsigned char *data1 = s1 ? cairo_image_surface_get_data(s1) : NULL;
    const unsigned char *data2 = s2 ? cairo_image_surface_get_data(s2) : NULL;
    unsigned char *datadiff = cairo_image_surface_get_data(diff);

    // we visualize the differences by taking one channel from s1
    // and the other two channels from s2:

    // first, copy s1 over:
    if (s1)
    {
        unsigned char *out = datadiff + r1.y * stridediff + r1.x * 4;
        for (int y = 0;
             y < r1.height;
             y++, data1 += stride1, out += stridediff)
        {
            memcpy(out, data1, r1.width * 4);
        }
    }

    // then, copy B channel from s2 over it; also compare the two versions
    // to see if there are any differences:
    if (s2)
    {
        unsigned char *out = datadiff + r2.y * stridediff + r2.x * 4;
        for (int y = 0;
             y < r2.height;
             y++, data2 += stride2, out += stridediff)
        {
            bool linediff = false;

            for (int x = 0; x < r2.width * 4; x += 4)
            {
                unsigned char cr1 = *(out + x + 0);
                unsigned char cg1 = *(out + x + 1);
                unsigned char cb1 = *(out + x + 2);

                unsigned char cr2 = *(data2 + x + 0);
                unsigned char cg2 = *(data2 + x + 1);
                unsigned char cb2 = *(data2 + x + 2);

                if (cr1 > (cr2 + g_channel_tolerance) || cr1 < (cr2 - g_channel_tolerance) || cg1 > (cg2 + g_channel_tolerance) || cg1 < (cg2 - g_channel_tolerance) || cb1 > (cb2 + g_channel_tolerance) || cb1 < (cb2 - g_channel_tolerance))
                {
                    pixel_diff_count++;
                    changes = true;
                    linediff = true;

                    if (thumbnail)
                    {
                        // calculate the coordinates in the thumbnail
                        int tx = int((r2.x + x / 4.0) * thumbnail_scale);
                        int ty = int((r2.y + y) * thumbnail_scale);

                        // Limit the coordinates to the thumbnail size (may be
                        // off slightly due to rounding errors).
                        // See https://github.com/vslavik/diff-pdf/pull/58
                        tx = std::min(tx, thumbnail_width - 1);
                        ty = std::min(ty, thumbnail_height - 1);

                        // mark changes with red
                        thumbnail->SetRGB(tx, ty, 255, 0, 0);
                    }
                }

                if (g_grayscale)
                {
                    // convert both images to grayscale, use blue for s1, red for s2
                    unsigned char gray1 = to_grayscale(cr1, cg1, cb1);
                    unsigned char gray2 = to_grayscale(cr2, cg2, cb2);
                    *(out + x + 0) = gray2;
                    *(out + x + 1) = (gray1 + gray2) / 2;
                    *(out + x + 2) = gray1;
                }
                else
                {
                    // change the B channel to be from s2; RG will be s1
                    *(out + x + 2) = cb2;
                }
            }

            if (g_mark_differences && linediff)
            {
                for (int x = 0; x < (10 < r2.width ? 10 : r2.width) * 4; x += 4)
                {
                    *(out + x + 0) = 0;
                    *(out + x + 1) = 0;
                    *(out + x + 2) = 255;
                }
            }
        }
    }

    // add background image of the page to the thumbnails
    if (thumbnail)
    {
        // copy the 'diff' surface into wxImage:
        wxImage bg(rdiff.width, rdiff.height);
        unsigned char *in = datadiff;
        unsigned char *out = bg.GetData();
        for (int y = 0; y < rdiff.height; y++, in += stridediff)
        {
            for (int x = 0; x < rdiff.width * 4; x += 4)
            {
                // cairo_surface_t uses BGR order, wxImage has RGB
                *(out++) = *(in + x + 2);
                *(out++) = *(in + x + 1);
                *(out++) = *(in + x + 0);
            }
        }

        // scale it to thumbnail size:
        bg.Rescale(thumbnail_width, thumbnail_height, wxIMAGE_QUALITY_HIGH);

        // and merge with the diff markers in *thumbnail, making it much
        // lighter in the process:
        in = bg.GetData();
        out = thumbnail->GetData();
        for (int i = thumbnail_width * thumbnail_height; i > 0; i--)
        {
            if (out[1] == 0) // G=0 ==> not white
            {
                // marked with red color, as place with differences -- don't
                // paint background image here, make the red as visible as
                // possible
                out += 3;
                in += 3;
            }
            else
            {
                // merge in lighter background image
                *(out++) = 128 + *(in++) / 2;
                *(out++) = 128 + *(in++) / 2;
                *(out++) = 128 + *(in++) / 2;
            }
        }

        // If there were no changes, indicate it by using green
        // (170,230,130) color for the thumbnail in gutter control:
        if (!changes)
        {
            out = thumbnail->GetData();
            for (int i = thumbnail_width * thumbnail_height;
                 i > 0;
                 i--, out += 3)
            {
                out[0] = 170 / 2 + out[0] / 2;
                out[1] = 230 / 2 + out[1] / 2;
                out[2] = 130 / 2 + out[2] / 2;
            }
        }
    }

    if (g_verbose)
        printf("page %d has %ld pixels that differ\n", page, pixel_diff_count);

    // If we specified a tolerance, then return if we have exceeded that for this page
    if (g_per_page_pixel_tolerance == 0 ? changes : pixel_diff_count > g_per_page_pixel_tolerance)
    {
        return diff;
    }
    else
    {
        cairo_surface_destroy(diff);
        return NULL;
    }
}
