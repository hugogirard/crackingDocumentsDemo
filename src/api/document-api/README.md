```
grep -A 100 "^dependencies" pyproject.toml | grep -E '^\s+"' | sed 's/^[[:space:]]*"//' | sed 's/",\?$//' > requirements.txt
```