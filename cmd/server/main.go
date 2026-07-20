/*
Copyright 2026 The BlanketOps Authors.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Command server serves the pre-built Docusaurus static site (docs/../build)
// over HTTP. Built and published as a container image via ko — the
// site's static files are baked in via ko's kodata convention: anything
// under cmd/server/kodata is bundled into the image and exposed at
// runtime through the KO_DATA_PATH environment variable ko sets.
package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	root := os.Getenv("KO_DATA_PATH")
	if root == "" {
		// Local `go run` without ko — serve the build output directly.
		root = "build"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.Handle("/", http.FileServer(http.Dir(root)))

	addr := ":" + port
	log.Printf("serving %s on %s", root, addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
