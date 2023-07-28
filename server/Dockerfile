FROM python:3.9.2

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 6543

ENTRYPOINT ["python", "websocket.py"]