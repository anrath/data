Apply security best practices to this code:

- Validate and sanitize all external inputs; never trust user data
- Escape output appropriately for context (HTML, SQL, shell)
- Use parameterized queries; prevent injection attacks
- Enforce authentication and authorization at every access point
- Apply principle of least privilege to permissions and data access
- Never expose secrets in code, logs, or client bundles
- Implement secure headers (CSP, CORS, HSTS) and HTTPS
- Handle errors without leaking sensitive information
- Audit dependencies for known vulnerabilities

