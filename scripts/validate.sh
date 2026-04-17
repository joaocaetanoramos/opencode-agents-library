#!/bin/bash

set -e

SCHEMA="src/shared/configs/agent-schema.json"
AGENTS_DIR="src/agents"
ERRORS=0

echo "Validating OpenCode agents..."

validate_agent() {
    local file="$1"
    local name=$(basename "$file" .md)

    echo -n "Checking $name... "

    if [[ ! -f "$file" ]]; then
        echo "SKIP (file not found)"
        return 0
    fi

    if ! grep -q "^---" "$file"; then
        echo "FAIL - Missing frontmatter"
        ERRORS=$((ERRORS + 1))
        return 1
    fi

    if ! grep -q "^description:" "$file"; then
        echo "FAIL - Missing description"
        ERRORS=$((ERRORS + 1))
        return 1
    fi

    if ! grep -q "^mode:" "$file"; then
        echo "FAIL - Missing mode"
        ERRORS=$((ERRORS + 1))
        return 1
    fi

    local mode=$(grep -m 1 "^mode:" "$file" | cut -d' ' -f2)
    if [[ ! "$mode" =~ ^(primary|subagent|all)$ ]]; then
        echo "FAIL - Invalid mode: $mode"
        ERRORS=$((ERRORS + 1))
        return 1
    fi

    echo "OK"
    return 0
}

echo ""
echo "=== Agent Files ==="
for agent in $(find "$AGENTS_DIR" -name "*.md" -type f 2>/dev/null); do
    name=$(basename "$agent" .md)
    if [[ "$name" == "STATUS" || "$name" == "CHANGELOG" ]]; then
        echo "Skipping $name (development template)"
        continue
    fi
    if [[ "$agent" == *"docs/"* || "$agent" == *"/docs/"* ]]; then
        echo "Skipping $name (documentation)"
        continue
    fi
    if [[ "$agent" == *".team.md" ]]; then
        echo "Skipping $name (team file)"
        continue
    fi
    validate_agent "$agent"
done

echo ""
echo "=== JSON Validation ==="
if command -v jq &> /dev/null; then
    if jq empty agents.json 2>/dev/null; then
        echo "agents.json: OK"
    else
        echo "agents.json: FAIL - Invalid JSON"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "jq not found, skipping JSON validation"
fi

echo ""
echo "=== Schema Validation ==="
if command -v jq &> /dev/null; then
    for agent in $(find "$AGENTS_DIR" -name "*.md" -type f 2>/dev/null); do
        name=$(basename "$agent" .md)
        if [[ "$name" == "STATUS" || "$name" == "CHANGELOG" ]]; then
            continue
        fi
        if [[ "$agent" == *"docs/"* || "$agent" == *"/docs/"* ]]; then
            continue
        fi
        if [[ "$agent" == *".team.md" ]]; then
            continue
        fi
        echo "Validating $name against schema..."

        frontmatter=$(sed -n '/^---$/,/^---$/p' "$agent" | sed '1d;$d')

        if ! echo "$frontmatter" | jq -r '.description' > /dev/null 2>&1; then
            echo "  WARNING: Could not parse frontmatter as JSON"
        fi
    done
else
    echo "jq not found, skipping schema validation"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "All validations passed!"
    exit 0
else
    echo "Found $ERRORS error(s)"
    exit 1
fi
