# Diagram CI/CD (Mermaid)

Poniżej prosty diagram Mermaid pokazujący proces: commit → build → test → deploy

```mermaid
flowchart LR
  A[Commit] --> B[Build]
  B --> C[Test]
  C --> D[Deploy]
```
![alt text](image.png)