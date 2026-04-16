## Code Review Guidelines

Use these criteria when reviewing code:

### Correctness
- Does the code do what it's supposed to do?
- Are edge cases handled?
- Are there potential bugs or race conditions?

### Security
- Is user input validated and sanitized?
- Are there injection vulnerabilities?
- Is sensitive data protected?
- Are authentication/authorization handled properly?

### Performance
- Are there obvious inefficiencies?
- Could algorithms be more efficient?
- Are there unnecessary allocations or copies?

### Maintainability
- Is the code readable and well-organized?
- Are functions/modules single-purpose?
- Is there appropriate abstraction?
- Are names descriptive?

### Error Handling
- Are errors handled explicitly?
- Is there appropriate logging?
- Are resources properly cleaned up?

### Testing
- Is there adequate test coverage?
- Do tests cover edge cases?
- Are tests independent?

## Severity Levels

| Level | Description |
|-------|-------------|
| **Critical** | Security vulnerability or data loss risk |
| **High** | Bug or design flaw that could cause issues |
| **Medium** | Performance or maintainability concern |
| **Low** | Minor improvement suggestion |
| **Info** | FYI, no action needed |
