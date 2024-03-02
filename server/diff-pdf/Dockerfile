# Build stage
FROM gcc:12.3.0-bullseye as builder
ARG REPO_URL=https://github.com/vslavik/diff-pdf.git
ARG REPO_REF=master

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libpoppler-glib-dev \
    libwxgtk3.0-gtk3-dev \
    git \
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /diff-pdf
RUN git clone --depth=1 --branch $REPO_REF $REPO_URL . \
    && ./bootstrap \
    && ./configure \
    && make

# Final stage
FROM debian:bullseye-slim
COPY --from=builder /diff-pdf/diff-pdf /usr/bin/diff-pdf

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libpoppler-glib8 \
    libwxgtk3.0-gtk3-0v5 \
    poppler-data \
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/*

# Command to run the application
ENTRYPOINT ["/usr/bin/diff-pdf"]
