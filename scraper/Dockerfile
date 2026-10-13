FROM golang:1.26.9-alpine3.23 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY ./*.go .
RUN go build -o main .


FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
RUN apk add --no-cache chromium

CMD ["./main"]