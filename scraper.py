import requests
import xml.etree.ElementTree as ET
import json
import os
import re
# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import firestore

# --- FIREBASE SETUP (UNCOMMENT TO USE) ---
# cred = credentials.Certificate('path/to/your/serviceAccountKey.json')
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# URL of the RSS feed
RSS_URL = "https://www.20minutos.es/rss/deportes/"

def clean_html(raw_html):
    """Remove HTML tags from a string."""
    if not raw_html:
        return ""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

def scrape_news():
    try:
        print(f"Fetching RSS feed from {RSS_URL}...")
        response = requests.get(RSS_URL)
        response.raise_for_status()

        # Parse XML
        root = ET.fromstring(response.content)

        news_items = []

        # Iterate over items (standard RSS format: channel -> item)
        for item in root.findall('./channel/item'):
            title = item.find('title').text
            description = item.find('description').text
            pub_date = item.find('pubDate').text
            # link = item.find('link').text # Not needed for this specific display but good to have if we expand

            if description:
                description = clean_html(description)
            else:
                description = "Sin descripción disponible."

            # Clean up title if needed (sometimes CDATA)
            if title:
                title = title.strip()

            # Simple date formatting if possible, or just keep as string
            # 20minutos format: Sat, 22 Nov 2025 13:28:21 +0100

            news_items.append({
                "title": title,
                "content": description,
                "date": pub_date
            })

            # Limit to top 6 news
            if len(news_items) >= 6:
                break

        # Generate news.json (Local Backup)
        with open('news.json', 'w', encoding='utf-8') as f:
            json.dump(news_items, f, ensure_ascii=False, indent=4)

        print(f"Successfully scraped {len(news_items)} news items to news.json")

        # --- UPLOAD TO FIREBASE (UNCOMMENT TO USE) ---
        # if 'db' in globals():
        #     print("Uploading to Firestore...")
        #     batch = db.batch()
        #     news_ref = db.collection('news')
        #
        #     for item in news_items:
        #         # Use title as ID or auto-id
        #         doc_ref = news_ref.document()
        #         batch.set(doc_ref, item)
        #
        #     batch.commit()
        #     print("Uploaded to Firestore.")

    except Exception as e:
        print(f"Error scraping news: {e}")
        # Create a fallback file if scraping fails
        fallback_news = [
            {"title": "Error al cargar noticias", "content": "No se pudieron obtener las noticias en tiempo real.", "date": "Hoy"}
        ]
        with open('news.json', 'w', encoding='utf-8') as f:
            json.dump(fallback_news, f, ensure_ascii=False)

if __name__ == "__main__":
    scrape_news()
