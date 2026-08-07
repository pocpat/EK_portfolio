"""
Compress PDFs by downsampling embedded images to 150 DPI and re-encoding JPEGs at 70% quality.
Uses PyMuPDF (fitz) to iterate pages, extract images, resize large ones, and rebuild the PDF.
"""
import fitz  # PyMuPDF
import io
import os
import sys
from pathlib import Path

PDF_DIR = Path(r"C:\Users\Elena\EK_portfolio\public")
MAX_IMAGE_DIM = 1500  # Max width/height in pixels (150 DPI for a ~10" page)
JPEG_QUALITY = 70     # 70% JPEG quality — visually fine for screen viewing

def compress_pdf(pdf_path):
    """Compress a single PDF by downsampling images. Returns (orig_size, new_size)."""
    orig_size = pdf_path.stat().st_size
    if orig_size < 200_000:
        return orig_size, orig_size  # Skip small files

    doc = fitz.open(str(pdf_path))

    # Track all images and replace large ones
    image_count = 0
    for page in doc:
        images = page.get_images(full=True)
        for img in images:
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                img_bytes = base_image["image"]
                img_ext = base_image["ext"]

                # Skip non-JPEG/PNG (unlikely in PDFs but safety)
                if img_ext not in ("jpeg", "jpg", "png"):
                    continue

                # Open with fitz Pixmap to check dimensions
                pix = fitz.Pixmap(base_image["image"])
                w, h = pix.width, pix.height

                # Only downscale if larger than our max
                if w <= MAX_IMAGE_DIM and h <= MAX_IMAGE_DIM:
                    continue

                # Calculate new dimensions
                scale = min(MAX_IMAGE_DIM / w, MAX_IMAGE_DIM / h)
                new_w = int(w * scale)
                new_h = int(h * scale)

                # Resize
                pix2 = fitz.Pixmap(pix, 0)  # ensure RGB
                if pix2.n > 4:
                    pix2 = fitz.Pixmap(fitz.csRGB, pix2)

                # Downscale using Irwin-Hann filter
                pix3 = fitz.Pixmap(pix2, new_w, new_h)
                pix2 = None

                # Convert to JPEG bytes
                img_io = io.BytesIO()
                pix3.pil_save(img_io, format="JPEG", quality=JPEG_QUALITY)
                pix3 = None
                new_bytes = img_io.getvalue()

                # Replace the image in the PDF
                doc.update_stream(xref, new_bytes)
                image_count += 1
            except Exception as e:
                print(f"  SKIP image xref={xref} on {pdf_path.name}: {e}", file=sys.stderr)
                continue

    # Save with maximum compression
    tmp_path = str(pdf_path) + ".tmp"
    doc.save(tmp_path, garbage=4, deflate=True, clean=True)
    doc.close()

    new_size = os.path.getsize(tmp_path)
    if new_size < orig_size:
        os.replace(tmp_path, str(pdf_path))
        print(f"  {image_count} images downsampled")
    else:
        os.remove(tmp_path)
        new_size = orig_size
        print(f"  No improvement (kept original)")

    return orig_size, new_size

# Process all PDFs
results = []
for pdf_file in sorted(PDF_DIR.glob("*.pdf")):
    name = pdf_file.name
    print(f"Processing: {name}")
    try:
        orig, new = compress_pdf(pdf_file)
        results.append((name, orig, new))
    except Exception as e:
        print(f"  ERROR: {e}", file=sys.stderr)
        results.append((name, pdf_file.stat().st_size, pdf_file.stat().st_size))

# Summary
print(f"\n{'='*90}")
print(f"{'File':<55} {'Before':>8} {'After':>8} {'Saved':>8} {'Ratio':>6}")
print(f"{'='*90}")
tb = ta = 0
for name, b, a in results:
    r = f"{a/b*100:.0f}%" if b > 0 else "N/A"
    print(f"{name:<55} {b/1024/1024:>6.1f}MB {a/1024/1024:>6.1f}MB {(b-a)/1024/1024:>6.1f}MB {r:>6}")
    tb += b
    ta += a
print(f"{'-'*90}")
print(f"{'TOTAL':<55} {tb/1024/1024:>6.1f}MB {ta/1024/1024:>6.1f}MB {(tb-ta)/1024/1024:>6.1f}MB {ta/tb*100:.0f}%")