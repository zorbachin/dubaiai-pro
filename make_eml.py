#!/usr/bin/env python3
"""
make_eml.py — Generate .eml files for Apple Mail from HTML emails.
Double-click the output .eml → Apple Mail opens it with Send button ready.

Usage:
  python3 make_eml.py

Or import and call make_eml() directly.
"""

import email.mime.multipart
import email.mime.text
import email.mime.image
import email.mime.base
import email.encoders
import mimetypes
import os
import sys


def make_eml(
    html_path: str,
    output_path: str,
    to: str,
    subject: str,
    from_name: str = "Zorba",
    from_email: str = "zgrashin@gmail.com",
    plain_text: str = "Please view this email in an HTML-capable mail client.",
    inline_images: list[dict] | None = None,
):
    """
    Build a .eml file ready to open in Apple Mail.

    inline_images: list of dicts with keys:
        - path: file path to the image
        - cid: the Content-ID used in the HTML (e.g. 'foxy_reveal_gif@buildyourbot')
        - filename: the filename in the email
    """
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Replace any external GIF/image URLs with cid: references if inline_images provided
    if inline_images:
        for img in inline_images:
            if "replace_url" in img:
                html = html.replace(img["replace_url"], f"cid:{img['cid']}")

    msg = email.mime.multipart.MIMEMultipart("related")
    msg["MIME-Version"] = "1.0"
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{from_email}>"
    msg["To"] = to

    alt = email.mime.multipart.MIMEMultipart("alternative")
    alt.attach(email.mime.text.MIMEText(plain_text, "plain", "utf-8"))
    alt.attach(email.mime.text.MIMEText(html, "html", "utf-8"))
    msg.attach(alt)

    if inline_images:
        for img in inline_images:
            mime_type, _ = mimetypes.guess_type(img["path"])
            maintype, subtype = (mime_type or "application/octet-stream").split("/", 1)
            with open(img["path"], "rb") as f:
                data = f.read()
            if maintype == "image":
                part = email.mime.image.MIMEImage(data, _subtype=subtype)
            else:
                part = email.mime.base.MIMEBase(maintype, subtype)
                part.set_payload(data)
                email.encoders.encode_base64(part)
            part.add_header("Content-ID", f"<{img['cid']}>")
            part.add_header("Content-Disposition", "inline", filename=img.get("filename", os.path.basename(img["path"])))
            msg.attach(part)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(msg.as_string())

    print(f"✓ Created: {output_path}")
    return output_path


if __name__ == "__main__":
    # ── Interactive mode ──────────────────────────────────────────────────────
    print("\n┌─ make_eml — Apple Mail Email Builder ─────────────────────────────┐")
    print("│  Generates a .eml file. Double-click it → Apple Mail → Send.      │")
    print("└───────────────────────────────────────────────────────────────────┘\n")

    html_path = input("HTML file path: ").strip()
    if not os.path.exists(html_path):
        print(f"Error: {html_path} not found")
        sys.exit(1)

    output_path = input("Output .eml path (Enter = same name with .eml): ").strip()
    if not output_path:
        output_path = os.path.splitext(html_path)[0] + ".eml"

    to = input("To (email address): ").strip()
    subject = input("Subject: ").strip()
    from_name = input("From name (Enter = Zorba): ").strip() or "Zorba"
    from_email = input("From email (Enter = zgrashin@gmail.com): ").strip() or "zgrashin@gmail.com"

    make_eml(
        html_path=html_path,
        output_path=output_path,
        to=to,
        subject=subject,
        from_name=from_name,
        from_email=from_email,
    )
    print(f"\n→ Open {output_path} in Apple Mail to review and send.")
