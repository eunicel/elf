package main

import (
  "bufio"
  "fmt"
  "io"
  "log"
  "math/rand"
  "net/http"
  "os"
  "regexp"
  "time"

  "github.com/gorilla/mux"
)

type entry_t struct {
  url         string
  pass        string
  expiration  time.Time
  lastAttempt time.Time
}

var (
  words           = make([]string, 0)
  available_words int
  data            = map[string]entry_t{
    "monkey": entry_t{
      url: "http://www.google.com",
    },
    "banana": entry_t{
      url: "http://www.youtube.com",
    },
    "cat": entry_t{
      url: "http://en.wikipedia.org",
    },
  }
)

func get_words() {
  re := regexp.MustCompile("^[a-z]+$")

  file, err := os.Open("dictionary.txt")
  if err != nil {
    log.Fatal(err)
  }
  defer file.Close()

  scanner := bufio.NewScanner(file)
  for scanner.Scan() {
    if re.MatchString(scanner.Text()) {
      words = append(words, scanner.Text())
    }
  }

  if err := scanner.Err(); err != nil {
    log.Fatal(err)
  }

  available_words = len(words)
}

func get_available_word() string {
  if available_words == 0 { 
    log.Fatal("Out of words")
  }
  idx := rand.Intn(available_words)
  key := words[idx]
  available_words--
  words[idx], words[available_words] = words[available_words], ""

  return key
}

func get(w http.ResponseWriter, r *http.Request) {
  params := mux.Vars(r)

  key := params["key"]
  pass := params["pass"]

  if entry, ok := data[key]; ok && entry.pass == pass {
    if time.Since(entry.expiration) < 0 || true {
      http.Redirect(w, r, entry.url, 302)
    } else {
      delete(data, key)
    }
  }
  http.Error(w, "404 Not Found", http.StatusNotFound)
}

func post(w http.ResponseWriter, r *http.Request) {
  params := mux.Vars(r)
  val := params["val"]
  pass := params["pass"]

  key := get_available_word()

  data[key] = entry_t{
    url:  fmt.Sprintf("http://www.%s.com", val),
    pass: pass,
  }
  io.WriteString(w, key)
}

func init() {
  get_words()
}

func main() {
  rtr := mux.NewRouter()
  rtr.HandleFunc("/{key:[a-z]+}", get).Methods("GET")
  rtr.HandleFunc("/{val:[a-z]+}", post).Methods("POST")
  rtr.HandleFunc("/{key:[a-z]+}/{pass:[a-z]+}", get).Methods("GET")
  rtr.HandleFunc("/{key:[a-z]+}/{pass:[a-z]+}", post).Methods("POST")

  http.Handle("/", rtr)

  log.Println("Listening...")
  http.ListenAndServe(":3000", nil)
}
