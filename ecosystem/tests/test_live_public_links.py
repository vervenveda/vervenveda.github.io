import unittest
from unittest.mock import Mock
from ecosystem.audit_live_public_links import allowed, approved, classify, probe

class AuditTests(unittest.TestCase):
    def test_policy(self):
        self.assertTrue(allowed("https://vervenveda.com/"))
        for url in ("http://vervenveda.com/", "https://evil.example/", "https://vervenveda.com/admin/", "https://vervenveda.com/?x=1", "https://user@vervenveda.com/"):
            self.assertFalse(allowed(url))
    def test_filter(self):
        row = dict(id="a",status="active",access="free-public",directoryVisible=True)
        self.assertEqual(approved({"entryCount":2,"entries":[row,dict(row,id="b",directoryVisible=False)]}),[row])
        with self.assertRaises(ValueError):
            approved({"entryCount":0,"entries":[row]})
    def test_status(self):
        for code,kind in [(404,"missing"),(403,"access-review"),(429,"transient"),(503,"transient"),(200,"http-ok")]:
            self.assertEqual(classify(code,"text/html",b"<title>Welcome</title>"),kind)
        self.assertEqual(classify(200,"text/html",b"<title>404 Page not found</title>"),"possible-soft-404")
    def test_redirect_block(self):
        opener=Mock()
        response=Mock()
        response.__enter__=Mock(return_value=response)
        response.__exit__=Mock(return_value=False)
        response.code=302
        response.headers={"Location":"https://evil.example/"}
        opener.open.return_value=response
        self.assertEqual(probe("https://vervenveda.com/",opener=opener)["result"],"blocked-url")
        self.assertEqual(opener.open.call_count,1)

if __name__ == "__main__":
    unittest.main()
