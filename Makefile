production: 
	cp -f configs/docker-compose-production.yml docker-compose.yml
	docker compose up -d --build --remove-orphans


dev:
	cp -f configs/docker-compose-dev.yml docker-compose.yml
	docker compose up -d --build --remove-orphans

dev-web:
	cp -f configs/docker-compose-dev.yml docker-compose.yml
	docker compose up -d --build --remove-orphans ui-web && docker logs -f -n 5 ui-web

test:
	cp -f configs/docker-compose-dev.yml docker-compose.yml
	docker compose up -d --build --remove-orphans ui-web && docker exec -it ui-web python manage.py test


shell:
	cp -f configs/docker-compose-dev.yml docker-compose.yml
	docker compose up -d --build --remove-orphans ui-web && docker exec -it ui-web python manage.py shell

stop:
	docker compose down
