#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# For information on the contents of the container image below, see following Dockerfile:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.43.0/containers/javascript-node-12/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0.43-12

# The image referenced above includes a non-root user with sudo access. Add 
# the "remoteUser" property to devcontainer.json to use it. On Linux, the container 
# user's GID/UIDs will be updated to match your local UID/GID when using the image
# or dockerFile property. Update USER_UID/USER_GID below if you are using the
# dockerComposeFile property or want the image itself to start with different ID
# values. See https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG USERNAME=node

# [Optional] Update UID/GID if needed
RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
        groupmod --gid $USER_GID $USERNAME \
        && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
        && chown -R $USER_UID:$USER_GID /home/$USERNAME; \
    fi \
    #
    # Avoid having to use "sudo" with "npm -g" when running as non-root user
    && SNIPPET='if [ "$(stat -c %U /usr/local/lib/node_modules)" != "$(id -u)" ]; then \
            sudo chown -R $(id -u):root /usr/local/lib/node_modules \
            && sudo chown -R $(id -u):root /usr/local/bin; \
        fi' \
    && echo $SNIPPET >> /home/$USERNAME/.bashrc \
    && echo $SNIPPET >> /home/$USERNAME/.zshrc \
    && chown $USERNAME /home/$USERNAME/.bashrc /home/$USERNAME/.zshrc \


# *************************************************************
# * Uncomment this section to use RUN instructions to install *
# * any needed dependencies after executing "apt-get update". *
# * See https://docs.docker.com/engine/reference/builder/#run *
# *************************************************************
# ENV DEBIAN_FRONTEND=noninteractive
# RUN sudo apt-get update \
#    && apt-get -y install postgresql-client \
   #
   # Clean up
#    && apt-get autoremove -y \
#    && apt-get clean -y \
#    && rm -rf /var/lib/apt/lists/*
# ENV DEBIAN_FRONTEND=dialog

# Uncomment to default to non-root user
# USER $USER_UID