# Ip Blocker

## Synopsis

Ip Blocker is a basic firewall application that reads access logs from nginx and disables the ip for a while that sends suspicious requests (such as php, admin, bin/sh). And also disable duration will increase depending on whether that continues the suspicious requests or decreases if that do not

## Warnings

- **It is not a production-ready project**. Use at your own risk.

- **Nginx access logs should be default. Custom pattern can not be parsed**

Example:

```
0.0.0.0 - - [21/Dec/2024:09:51:02 +0000] "GET /admin/config.php HTTP/1.0" 301 169 "-" "xfa1"
```

- This application developed for a nest/angular project. **If you use php or any language other than js, application can be broke (or users may be unable to connect your application for a long time) because of this.** Then, you need to edit the `IpOperator.reviewIncoming(ipAddress: string, urlPath: string)` method at `src/ip-operator.ts` for your application's requirements
  and rebuild the project

- It depends the "iptables" command. Because of this. it will run on only Linux systems (not guaranteed for non-GNU Linux distros such as Alpine)

- Pull Requests or Feedbacks are welcomed. If you have any questions, please do not hesitate to contact me.

## How Works?

- Application will read the last row of the access log
- If there is a suspicious request
  - Penalty point will be increased by 1.
  - Penalized user's all requests will be disabled until the penalty expires
    - `iptables -I FORWARD -s {SUSPICIOUS IP} ACCEPT` will be called when ip penalized
    - When the expire time come, `iptables -I FORWARD -s {SUSPICIOUS IP} DROP` will be called.
  - Penalty duration will be calculated as
    - ${{penalty point} ^ 2} * 5$ seconds
  - Otherwise, there is not suspicious request
    - If greater than 0, penalty point will decreased by 1.

## Usage

### Run in docker

- The container should
  - have `NET_ADMIN` and `NET_RAW` capabilities
  - `network_mode` setting set as `host`

You can pull the image as `hcangunduz/tk-nginx-ip-blocker` (only x86) as this version. Or you can build your version of this project via following code.

```sh
docker build --tag my-ip-blocker .
```

There is a docker-compose example

```yml
services:
  ip-blocker:
    cap_add:
      - NET_ADMIN
      - NET_RAW
    image: hcangunduz/tk-nginx-ip-blocker # if it is custom build, replace with "my-ip-blocker"
    volumes:
      - ./logs/webapp:/var/log/webapp
    environment:
      - NGINX_ACCESS_LOG_PATH=/var/log/webapp/access.log
    network_mode: host
```

### Rebuild and run as node application

It designed to be runned on Docker. You can run the application by running following commands. But `ipOperator.penalizementAction` subscription should be edited for your requirements and the iptable chain `FORWARD` should be replaced with the chain you needed.

- Don't forget to change `<your nginx access logs path>` with your path

```
export NGINX_ACCESS_LOG_PATH=<your nginx access logs path>
npm run build
npm run start
```

- You might want to run as service. In this case, you can read this [tutorial](https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1)
