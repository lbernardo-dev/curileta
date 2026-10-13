from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / "apps" / "web" / "public"
IMAGE_DIR = PUBLIC / "images" / "events" / "masks"
OUTPUT_DIR = PUBLIC / "files" / "events" / "masks"
PAGE_WIDTH, PAGE_HEIGHT = A4
GREEN = (0.02, 0.35, 0.27)
INK = (0.08, 0.12, 0.18)
MUTED = (0.30, 0.36, 0.43)

MASKS = [
    {
        "slug": "curileta",
        "title": "Máscara de Curileta",
        "english": "Curileta mask",
        "image": "curileta-mask-v1.png",
        "size": (1536, 1024),
        "eyes": [(522, 624, 104), (1010, 624, 104)],
    },
    {
        "slug": "pompon",
        "title": "Máscara de Pompón",
        "english": "Pompon mask",
        "image": "pompon-mask-v1.png",
        "size": (1312, 1199),
        "eyes": [(466, 790, 88), (844, 790, 88)],
    },
]


def draw_mask(mask: dict[str, object]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f"{mask['slug']}-mask-v1.pdf"
    source = IMAGE_DIR / str(mask["image"])
    page = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    page.setTitle(f"{mask['title']} | Curileta")
    page.setAuthor("Curileta")
    page.setSubject("Máscara imprimible para recortar")

    page.setFillColorRGB(*GREEN)
    page.rect(0, PAGE_HEIGHT - 5, PAGE_WIDTH, 5, stroke=0, fill=1)
    page.setFillColorRGB(*GREEN)
    page.setFont("Helvetica-Bold", 10)
    page.drawString(42, PAGE_HEIGHT - 36, "CURILETA  ·  ACTIVIDAD PARA IMPRIMIR")

    page.setFillColorRGB(*INK)
    page.setFont("Helvetica-Bold", 23)
    page.drawString(42, PAGE_HEIGHT - 70, str(mask["title"]))
    page.setFillColorRGB(*MUTED)
    page.setFont("Helvetica", 11)
    page.drawString(42, PAGE_HEIGHT - 91, str(mask["english"]))
    page.drawString(42, PAGE_HEIGHT - 109, "Imprime en papel A4 al 100%  ·  Print on A4 paper at 100%")

    box_x, box_y, box_width, box_height = 36, 132, PAGE_WIDTH - 72, PAGE_HEIGHT - 270
    image = ImageReader(str(source))
    source_width, source_height = mask["size"]  # type: ignore[misc]
    scale = min(box_width / source_width, box_height / source_height)
    draw_width, draw_height = source_width * scale, source_height * scale
    draw_x = box_x + (box_width - draw_width) / 2
    draw_y = box_y + (box_height - draw_height) / 2
    page.drawImage(image, draw_x, draw_y, width=draw_width, height=draw_height, mask="auto")

    page.setStrokeColorRGB(*INK)
    page.setLineWidth(1.25)
    page.setDash(4, 3)
    for source_x, source_y, radius in mask["eyes"]:  # type: ignore[assignment]
        center_x = draw_x + (source_x / source_width) * draw_width
        center_y = draw_y + ((source_height - source_y) / source_height) * draw_height
        scaled_radius = radius * scale
        page.circle(center_x, center_y, scaled_radius, stroke=1, fill=0)
    page.setDash()

    page.setStrokeColorRGB(0.56, 0.60, 0.63)
    page.setLineWidth(0.65)
    page.line(42, 111, PAGE_WIDTH - 42, 111)
    page.setFillColorRGB(*INK)
    page.setFont("Helvetica-Bold", 10)
    page.drawString(42, 94, "Recorta el contorno, los ojos y los puntos laterales.")
    page.setFillColorRGB(*MUTED)
    page.setFont("Helvetica", 9)
    page.drawString(42, 78, "Cut out the outline, eye guides and small side holes.")
    page.drawString(42, 61, "Pide ayuda a una persona adulta al usar tijeras.  ·  Ask an adult for help with scissors.")
    page.setFillColorRGB(*GREEN)
    page.setFont("Helvetica-Bold", 8)
    page.drawRightString(PAGE_WIDTH - 42, 34, "CURI LETA  ·  LAS AVENTURAS")
    page.showPage()
    page.save()
    print(output)


if __name__ == "__main__":
    for item in MASKS:
        draw_mask(item)
