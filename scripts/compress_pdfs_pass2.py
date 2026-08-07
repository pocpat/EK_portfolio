"""
Second pass: rebuild stubborn PDFs by rendering each page to a JPEG image
and creating a new PDF from those images. This guarantees compression for
PDFs with embedded images that PyMuPDF can't replace in-place.
"""
import fitz
import io
import os
from pathlib import Path

PDF_DIR = Path(r"C:\Users\Elena\EK_portfolio\public")

# Only target files still over 3 MB
TARGETS = [
    "AZ-Generative_AI.pdf",
    "AZ-Hybrid_Cloud_Deployment_and_Security.pdf",
    "AZ-Cloud_Network_Security.pdf",
    "AZ-FABRIC.pdf",
    "AZ-MS_EntraID.pdf",
    "AWS-network_security_and_analysis.pdf",
    "AWS-multi-part-upload.pdf",
    "AWS-multi-part-upload-S3-MFA-Delete.pdf",
    "ekawstechdoc.pdf",
    "AZ-Create_ML_Pipeline.pdf",
    "AZ-ML_Applications_Cloud_Resource_Allocation.pdf",
]

PAGE_DPI = 150      # Render at 150 DPI (good screen quality)
JPEG_QUALITY = 70   # JPEG quality for page images

def rebuild_pdf(pdf_path):
    """Render each page as a JPEG, then assemble into a new PDF."""
    orig = pdf_path.stat().st_size
    doc = fitz.open(str(pdf_path))
    
    new_doc = fitz.open()  # empty new PDF
    
    for page in doc:
        # Render page to pixmap at target DPI
        mat = fitz.Matrix(PAGE_DPI / 72, PAGE_DPI / 72)
        pix = page.get_pixmap(matrix=mat)
        
        # Convert to JPEG bytes
        img_io = io.BytesIO()
        pix.pil_save(img_io, format="JPEG", quality=JPEG_QUALITY)
        img_bytes = img_io.getvalue()
        
        # Create a new page with same dimensions as original
        rect = page.rect
        new_page = new_doc.new_page(width=rect.width, height=rect.height)
        
        # Insert the JPEG image into the page
        new_page.insert_image(rect, stream=img_bytes)
    
    doc.close()
    
    # Save new PDF
    tmp_path = str(pdf_path) + ".tmp2"
    new_doc.save(tmp_path, garbage=4, deflate=True, clean=True)
    new_doc.close()
    
    new_size = os.path.getsize(tmp_path)
    if new_size < orig:
        os.replace(tmp_path, str(pdf_path))
        return orig, new_size
    else:
        os.remove(tmp_path)
        return orig, orig

results = []
for name in TARGETS:
    pdf_path = PDF_DIR / name
    if not pdf_path.exists():
        continue
    orig_size = pdf_path.stat().st_size
    if orig_size < 2_000_000:
        continue
    print(f"Rebuilding: {name} ({orig_size/1024/1024:.1f}MB)")
    try:
        orig, new = rebuild_pdf(pdf_path)
        saved = orig - new
        print(f"  -> {new/1024/1024:.1f}MB (saved {saved/1024/1024:.1f}MB)")
        results.append((name, orig, new))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append((name, orig_size, orig_size))

print(f"\n{'='*80}")
tb = ta = 0
for name, b, a in results:
    print(f"{name:<55} {b/1024/1024:>6.1f}MB -> {a/1024/1024:>6.1f}MB")
    tb += b; ta += a
print(f"{'-'*80}")
print(f"Second-pass total: {tb/1024/1024:.1f}MB -> {ta/1024/1024:.1f}MB (saved {(tb-ta)/1024/1024:.1f}MB)")