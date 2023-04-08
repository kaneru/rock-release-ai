# UNIVERSAL DOCKER BUILD (minimal)
.PHONY:
build-APP_NAME_STUB:
	@echo 'build APP_NAME_STUB'
	docker build --no-cache --rm --progress=plain -t $(REGISTRY_HOST)/$(PROJECT_NAME)/$(APP_NAME):$(APP_VERSION) -f $(DOCKERFILE_NAME) \
		--build-arg GITHUB_ACCESS_TOKEN=$(GITHUB_ACCESS_TOKEN) --build-arg APP_VERSION=$(APP_VERSION) --build-arg BUILD_DIR=$(BUILD_DIR) .
