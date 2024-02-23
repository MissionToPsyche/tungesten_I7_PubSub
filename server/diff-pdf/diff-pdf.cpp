
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
