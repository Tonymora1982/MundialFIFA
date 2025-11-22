import pytest
from playwright.sync_api import Page, expect
import os
import json

# Fixture to load the page
@pytest.fixture
def index_page(page: Page):
    cwd = os.getcwd()
    file_url = f"file://{cwd}/index.html"
    page.goto(file_url)
    return page

def test_hero_section_visible(index_page: Page):
    """Verify the hero section and main title are visible."""
    expect(index_page.locator(".hero")).to_be_visible()
    expect(index_page.locator(".mega-title")).to_contain_text("MUNDIAL")
    expect(index_page.locator(".mega-title")).to_contain_text("FIFA 2026")

def test_countdown_visible(index_page: Page):
    """Verify the countdown timer is visible."""
    expect(index_page.locator("#countdown-container")).to_be_visible()
    expect(index_page.locator("#days")).to_be_visible()
    expect(index_page.locator("#hours")).to_be_visible()

def test_news_section_loads(index_page: Page):
    """Verify that news cards are loaded (either from JSON or fallback)."""
    # Wait for potential fetch/animation
    index_page.wait_for_timeout(1000)

    news_section = index_page.locator("#daily-news")
    expect(news_section).to_be_visible()

    # Check that there is at least one news card
    news_cards = index_page.locator(".news-card")
    expect(news_cards.first).to_be_visible()
    assert news_cards.count() > 0

def test_matches_render(index_page: Page):
    """Verify that match cards are rendered."""
    matches_section = index_page.locator("#live-matches-container")
    expect(matches_section).to_be_visible()

    match_cards = index_page.locator(".match-card")
    expect(match_cards.first).to_be_visible()
    assert match_cards.count() > 0

def test_match_simulation_updates(index_page: Page):
    """Verify that the match time updates over time."""
    # Get initial time of the first match
    match_time_locator = index_page.locator(".match-status").first
    initial_text = match_time_locator.inner_text()

    # Wait for 4 seconds (interval is 2s)
    index_page.wait_for_timeout(4000)

    # Get updated time
    updated_text = match_time_locator.inner_text()

    # Assertion: The text should have changed (e.g., minute incremented)
    # Note: If the match is at 90', it might not increment, but our mock data starts at 1' and 85'.
    # 85' -> 87' -> 89' -> 90'. 1' -> 3' -> 5'. Both should change.
    assert initial_text != updated_text, f"Match time did not update. Initial: {initial_text}, Updated: {updated_text}"

def test_groups_table_render(index_page: Page):
    """Verify that group tables are rendered."""
    groups_container = index_page.locator("#groups-container")
    expect(groups_container).to_be_visible()

    # Check for at least one group card
    expect(index_page.locator(".group-card").first).to_be_visible()

    # Check for table headers
    expect(index_page.locator("th", has_text="Equipo").first).to_be_visible()

def test_responsive_mobile(page: Page):
    """Verify basic responsiveness on a mobile viewport."""
    cwd = os.getcwd()
    file_url = f"file://{cwd}/index.html"

    # Set viewport to iPhone 12 size
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(file_url)

    # Check if Mega Title scales (visual check via computed style or just visibility)
    # In style.css we set font-size to 18vw for mobile
    mega_title = page.locator(".mega-title")
    expect(mega_title).to_be_visible()

    # Check if grid columns stack (news cards should be full width roughly)
    # We can check if the grid container is visible
    expect(page.locator("#news-container")).to_be_visible()
