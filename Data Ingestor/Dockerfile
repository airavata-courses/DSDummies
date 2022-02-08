FROM continuumio/miniconda3

WORKDIR /app

# Create the environment:
COPY environment.yml .
RUN conda env create -f environment.yml

# RUN conda create -n myenv

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "nexrad-env", "/bin/bash", "-c"]

# Demonstrate the environment is activated:
RUN echo "Make sure flask is installed:"
RUN python -c "import flask"


# The code to run when container is started:
COPY . .

# RUN pip install -r requirements.txt

EXPOSE 5678

ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "nexrad-env", "python3", "main.py"]