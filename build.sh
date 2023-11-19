rm main
echo build $1
go build main.go
docker build -t gasbugs/http-go:$1 .
docker push gasbugs/http-go:$1
