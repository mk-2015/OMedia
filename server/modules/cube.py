import http.client
import json
import secrets
from fastapi import APIRouter, Request, HTTPException, status
from typing import List, Dict, Any
from modules.auth import require_session

cube_router = APIRouter()
vmrunn: List[Dict[str, Any]] = []

WORKER_POOL: List[Dict[str, Any]] = []
CLUSTER_SECRET: str = ""

def init_cube_cluster(workers: List[Dict[str, Any]], secret: str):
    global WORKER_POOL, CLUSTER_SECRET
    WORKER_POOL = workers
    CLUSTER_SECRET = secret

@cube_router.post("/api/cube")
def cubemsg(request: Request):
    return "Under Construction"