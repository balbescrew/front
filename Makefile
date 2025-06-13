build: 
	docker build -t demianight/anti_spam_front:latest .
run:
	docker run --name anti_spam_front -p 3000:80 demianight/anti_spam_front
kill:
	docker rm -f anti_spam_front
push:
	docker push demianight/anti_spam_front:latest
prod:
	docker buildx build --platform linux/amd64 -t demianight/anti_spam_front:latest --push .