# data // anrath

A publically accessible static file repository hosted on GitHub Pages. Files can be retrieved via browser or CLI tools like `curl`.

URL: [anrath.github.io/data/](https://anrath.github.io/data/)

## 🛠 Features

- **Dithered UI**: A sleek, high-contrast retro-tech homepage.
- **Easy Retrieval**: Click any file on the homepage to copy its direct URL.
- **CLI Friendly**: Optimized for quick access via `curl` or `wget`.
- **Automatic Indexing**: Self-generating file manifest.

## 🚀 Usage

### Browser
Navigate to [anrath.github.io/data/](https://anrath.github.io/data/) to browse files visually. Double-click a file to open it directly, or single-click to copy its URL.

### Command Line
Grab any file directly using `curl`:

```bash
curl -O https://anrath.github.io/data/files/example.file
```

#### Recursive Download (Directories)
To download an entire directory and its subdirectories, you can use the following command (also available by clicking the **CURL** button next to any directory on the website):

```bash
curl -s https://anrath.github.io/data/files.txt | grep "^cursor/" | while read -r line; do curl --create-dirs -o "$line" "https://anrath.github.io/data/files/$line"; done
```

This downloads files to a clean directory structure (e.g., `cursor/prompts/performance.md`) without the `files/` prefix.

Alternatively, use `wget` for recursive downloads:

```bash
wget -r -np -nH --cut-dirs=2 -R "index.html*" https://anrath.github.io/data/files/cursor/
```

## 📂 Project Structure

- `/files`: The directory where all public files are stored.
- `index.html`: The dithered homepage.
- `generate_manifest.js`: Script to update the file index.
- `files.json`: Nested index of all files and directories.
- `files.txt`: Flat list of all file paths (used for recursive curl downloads).

## 💻 Local Development

To run the website locally for testing:

1. **Start a local server**:
   Using Python (standard on most systems):
   ```bash
   python3 -m http.server 8000
   ```
   Or using Node.js:
   ```bash
   npx serve .
   ```

2. **Access the site**:
   Open your browser and navigate to `http://localhost:8000`.

3. **Updating the manifest**:
   If you change files in the `/files` directory, regenerate the index:
   ```bash
   npm run generate
   ```

## 🔄 Adding Files

1. Place your file in the `files/` directory (or a subdirectory).
2. Update the manifest:
   ```bash
   npm run generate
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Add new files"
   git push origin main
   ```

## 🎨 Aesthetic

The homepage uses a 1-bit dithered pattern with scanlines and noise overlays to create a retro-terminal feel.

---
*PUBLIC_ACCESS_ENABLED*

