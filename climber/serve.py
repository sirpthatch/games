#!/usr/bin/env python3
"""Static file server with no-cache headers for local dev."""
import http.server
import socketserver

PORT = 8765


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), NoCacheHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f'serving on http://localhost:{PORT}  (no-cache)')
        httpd.serve_forever()
