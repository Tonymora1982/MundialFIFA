import pytest
from scraper import clean_html

def test_clean_html_basic():
    """Test removing basic HTML tags."""
    raw = "<p>Hello <b>World</b></p>"
    cleaned = clean_html(raw)
    assert cleaned == "Hello World"

def test_clean_html_nested():
    """Test removing nested HTML tags."""
    raw = "<div><p>Nested <span>Text</span></p></div>"
    cleaned = clean_html(raw)
    assert cleaned == "Nested Text"

def test_clean_html_attributes():
    """Test removing tags with attributes."""
    raw = '<a href="https://example.com">Link</a>'
    cleaned = clean_html(raw)
    assert cleaned == "Link"

def test_clean_html_empty():
    """Test handling empty or None input."""
    assert clean_html("") == ""
    assert clean_html(None) == ""

def test_clean_html_no_tags():
    """Test input with no tags."""
    raw = "Just text"
    cleaned = clean_html(raw)
    assert cleaned == "Just text"
