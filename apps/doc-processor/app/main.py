from fastapi import FastAPI

app = FastAPI(title="ExamForge Doc Processor")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
