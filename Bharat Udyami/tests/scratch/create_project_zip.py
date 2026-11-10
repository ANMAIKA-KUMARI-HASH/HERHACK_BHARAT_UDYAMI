import os
import sys
import zipfile
import time

def create_project_zip():
    root_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    parent_dir = os.path.dirname(root_dir)
    zip_filename = "Bharat-Udyami-Project.zip"
    zip_path = os.path.join(parent_dir, zip_filename)

    print(f"Project Root Directory : {root_dir}")
    print(f"Parent Directory       : {parent_dir}")
    print(f"Target ZIP Archive     : {zip_path}")
    print("-" * 70)

    # Directories to strictly exclude
    exclude_dirs = {
        'node_modules',
        '.git',
        '__pycache__',
        'dist',
        '.vite',
        '.pytest_cache',
        '.cache',
        '.idea',
        '.vscode'
    }

    # Files to strictly exclude (secrets, temporary, logs, caches)
    exclude_extensions = ('.pyc', '.pyo', '.pyd', '.tmp', '.log', '.DS_Store')

    def is_secret_file(filename):
        # Exclude .env, .env.local, .env.development, etc.
        # But KEEP .env.example as documentation template
        if filename == '.env' or (filename.startswith('.env.') and not filename.endswith('.example')):
            return True
        if filename in ('id_rsa', 'id_rsa.pub', 'credentials.json', 'client_secret.json'):
            return True
        return False

    included_files = []
    excluded_files = []

    start_time = time.time()

    print("Scanning and compressing project files...")
    with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Prune directories in-place so os.walk does not recurse into them
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

            for filename in sorted(filenames):
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)

                # Skip the archive itself if somehow found
                if os.path.abspath(full_path) == os.path.abspath(zip_path):
                    continue

                # Exclude secrets
                if is_secret_file(filename):
                    excluded_files.append((rel_path, "Secret/Credential File"))
                    continue

                # Exclude temp / cache files
                if filename.endswith(exclude_extensions) or filename in ('Thumbs.db', '.DS_Store'):
                    excluded_files.append((rel_path, "Cache/Temp File"))
                    continue

                # Store inside zip with forward slashes for cross-platform compatibility
                archive_name = rel_path.replace(os.sep, '/')
                zipf.write(full_path, arcname=archive_name)
                included_files.append((rel_path, archive_name, os.path.getsize(full_path)))

    duration = time.time() - start_time
    zip_size_bytes = os.path.getsize(zip_path)
    zip_size_kb = zip_size_bytes / 1024
    zip_size_mb = zip_size_bytes / (1024 * 1024)

    print("\n" + "=" * 70)
    print("ZIP CREATION VERIFICATION")
    print("=" * 70)
    print(f"Archive File Path : {zip_path}")
    print(f"Archive Exists    : {os.path.exists(zip_path)}")
    print(f"Archive File Size : {zip_size_bytes:,} bytes ({zip_size_kb:.2f} KB / {zip_size_mb:.2f} MB)")
    print(f"Total Files Added : {len(included_files)}")
    print(f"Total Files Saved : {len(excluded_files)} excluded (secrets/caches)")
    print(f"Compression Time  : {duration:.2f} seconds")

    # Thorough integrity check
    print("\nPerforming ZIP Integrity and Structure Verification...")
    with zipfile.ZipFile(zip_path, 'r') as verify_zip:
        # Test ZIP CRC-32 checksums
        test_result = verify_zip.testzip()
        if test_result is not None:
            raise RuntimeError(f"Corrupt file found in ZIP: {test_result}")
        print("[PASS] Checksum & CRC-32 test: No corrupted files found.")

        namelist = set(verify_zip.namelist())

        # Verify key project files are present
        required_keys = [
            "README.md",
            "test_live_system_qa.py",
            "backend/app.py",
            "backend/database.py",
            "backend/email_service.py",
            "backend/multilingual_engine.py",
            "backend/photo_studio.py",
            "backend/requirements.txt",
            "backend/.env.example",
            "backend/bharatudyami.db",
            "frontend/package.json",
            "frontend/src/App.jsx",
            "frontend/src/pages/ProductStudio.jsx",
            "frontend/vite.config.js",
            "frontend/index.html"
        ]

        for req in required_keys:
            if req not in namelist:
                raise AssertionError(f"Critical required file missing from ZIP: {req}")
            print(f"[PASS] Verified essential file present: {req}")

        # Verify prohibited items are strictly absent
        for name in namelist:
            if "node_modules" in name:
                raise AssertionError(f"Forbidden directory found in ZIP: {name}")
            if "__pycache__" in name:
                raise AssertionError(f"Forbidden cache directory found in ZIP: {name}")
            if name.endswith(".pyc"):
                raise AssertionError(f"Forbidden .pyc file found in ZIP: {name}")
            if name == "backend/.env" or name == ".env" or (name.endswith("/.env") and not name.endswith(".env.example")):
                raise AssertionError(f"Forbidden secret file found in ZIP: {name}")

        print("[PASS] Verified all secrets (.env), node_modules, and __pycache__ are strictly excluded.")

    print("\n" + "=" * 70)
    print("SUCCESS: Bharat-Udyami-Project.zip is verified and ready!")
    print("=" * 70)
    return zip_path, zip_size_bytes

if __name__ == "__main__":
    create_project_zip()
