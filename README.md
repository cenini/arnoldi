# Arnoldi

An AI life coach that helps users navigate their lives, while motivating them to get very, very swole.

## Quickstart

Set up environment variables in `.env`. Feel free to use [`.env.template`](./.env.template) as a template.

To deploy, run:

```
docker compose --env-file .env -f docker-compose-prod.yml up -d
```

## Architecture

The application is very simple currently, only consists of two servies - a frontend and a backend. The backend communicates also with an external database, and later on a vector store.

## License
 
The MIT License (MIT)

Copyright (c) 2023 Niklas Nilsson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
