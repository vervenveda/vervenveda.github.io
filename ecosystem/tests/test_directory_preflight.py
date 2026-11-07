"""Regression tests for the read-only VNV directory preflight (stdlib only)."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/"directory_preflight.py"
spec=importlib.util.spec_from_file_location("vnv_directory_preflight",SCRIPT)
preflight=importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)

class DirectoryPreflightTests(unittest.TestCase):
    def fixture(self):
        tmp=tempfile.TemporaryDirectory()
        root=Path(tmp.name)
        (root/"ecosystem").mkdir()
        (root/"registry").mkdir()
        master={
            "entryCount":2,
            "entries":[
                {"id":"public","url":"https://vervenveda.com/","repository":"vervenveda/vervenveda.github.io","path":"index.html","status":"active","access":"free-public","directoryVisible":True},
                {"id":"admin","url":"https://vervenveda.com/admin/","repository":"vervenveda/vervenveda.github.io","path":"admin/index.html","status":"admin","access":"free-public","directoryVisible":False},
            ],
            "pageCatalog":{"parts":["/registry/ecosystem-pages-a.json","/registry/ecosystem-pages-b.json"],
              "publicPageCount":2,"repositoryCount":1,"autoSync":{"generatedAt":"2026-11-06T00:00:00Z"}}
        }
        shards=[
            {"generatedAt":"2026-11-06T00:00:00Z","pages":[{"url":"https://vervenveda.com/","path":"index.html","repo":"vervenveda.github.io"}]},
            {"generatedAt":"2026-11-06T00:00:00Z","pages":[{"url":"https://vervenveda.com/tour/","path":"tour/index.html","repo":"vervenveda.github.io"}]},
        ]
        self.write(root,master,shards)
        return tmp,root,master,shards

    @staticmethod
    def write(root,master,shards):
        (root/"ecosystem/master-ecosystem-directory.json").write_text(json.dumps(master),encoding="utf-8")
        for name,shard in zip("ab",shards):
            (root/f"registry/ecosystem-pages-{name}.json").write_text(json.dumps(shard),encoding="utf-8")

    def test_hidden_admin_is_not_a_public_failure(self):
        tmp,root,master,shards=self.fixture()
        with tmp:self.assertTrue(preflight.check(root)["ok"])

    def test_missing_shard_fails_closed(self):
        tmp,root,master,shards=self.fixture()
        with tmp:
            (root/"registry/ecosystem-pages-b.json").unlink()
            self.assertIn("SHARD_UNREADABLE",preflight.check(root)["errors"])

    def test_generation_mismatch_fails_closed(self):
        tmp,root,master,shards=self.fixture()
        with tmp:
            shards[1]["generatedAt"]="wrong"
            self.write(root,master,shards)
            self.assertIn("SHARD_GENERATION_MISMATCH",preflight.check(root)["errors"])

    def test_duplicate_catalog_url_fails_closed(self):
        tmp,root,master,shards=self.fixture()
        with tmp:
            shards[1]["pages"][0]["url"]=shards[0]["pages"][0]["url"]
            self.write(root,master,shards)
            self.assertIn("CATALOG_DUPLICATE_URL",preflight.check(root)["errors"])

    def test_public_admin_path_fails_closed(self):
        tmp,root,master,shards=self.fixture()
        with tmp:
            master["entries"][1].update(directoryVisible=True,status="active")
            self.write(root,master,shards)
            self.assertIn("PUBLIC_ENTRY_PATH_FORBIDDEN",preflight.check(root)["errors"])

    def test_page_count_mismatch_fails_closed(self):
        tmp,root,master,shards=self.fixture()
        with tmp:
            master["pageCatalog"]["publicPageCount"]=3
            self.write(root,master,shards)
            self.assertIn("CATALOG_PAGE_COUNT_MISMATCH",preflight.check(root)["errors"])

if __name__=="__main__":
    unittest.main()
