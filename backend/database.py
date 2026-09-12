"""
Slope Safe – Database Engine
Configures SQLAlchemy with MySQL (or fallback SQLite for quick evaluation without local MySQL daemon).
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "slope_safe_db")

# Connection URL
if os.getenv("USE_SQLITE", "false").lower() == "true" or not MYSQL_PASSWORD and os.getenv("MYSQL_HOST") is None:
    # Use SQLite for seamless local evaluation without requiring MySQL daemon to be pre-started
    DATABASE_URL = "sqlite:///./slope_safe.db"
    connect_args = {"check_same_thread": False}
else:
    DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    connect_args = {}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    # Fallback to local SQLite if MySQL is unreachable
    print(f"[SlopeSafe] Warning: Could not connect to MySQL ({e}). Falling back to sqlite:///./slope_safe.db")
    engine = create_engine("sqlite:///./slope_safe.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
