from datetime import datetime

def format_upload_date(date_str: str) -> str:
    """
    Converts ISO-8601 timestamp to '18 August 2025'.
    Returns 'Not available' if the value is missing or invalid.
    """
    
    if not date_str:
        return "Not available"

    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.strftime("%d %B %Y")
    except Exception:
        return "Not available"
