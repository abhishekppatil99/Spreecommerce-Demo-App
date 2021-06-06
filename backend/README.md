# Fastify

## Links
[Fastify + Typescript with Mongoose](https://medium.com/sharenowtech/fastify-with-typescript-production-ready-integration-2303318ecd9e)

[Mongoose with Typescript](https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1)

[Fastify Plugins](https://www.fastify.io/docs/latest/Plugins-Guide/)

[Fastify Decorators](https://www.fastify.io/docs/latest/Decorators/)

[Fastify + Typescript docs](https://www.fastify.io/docs/latest/TypeScript/)

## Plugins
```typescript 
import fp from 'fastify-plugin'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string;
  }
}
```

```typescript 
import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
  server.route({
    url: "/status",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    handler: async (request, reply) => {
      return reply.send({ date: new Date(), works: true });
    }
  });
  next();
});
```

## Routes

```typescript 
import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
}

export default root;
```

## Autoloading

```typescript 
import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

};

export default app;
export { app }

```

## DB

```typescript 
import fp from 'fastify-plugin'
import mongoose from "mongoose";

export interface MongoPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<MongoPluginOptions>(async (fastify, opts, next) => {
    const mongodbHost: string = process.env.MONGO_DB_HOST || "localhost";
    const mongodbPort: string = process.env.MONGO_DB_PORT || "27017";
    const mongodbDatabase: string = process.env.MONGO_DB_DATABASE || "default_db";

    try {
        mongoose.connect(
            `mongodb://${mongodbHost}:${mongodbPort}/${mongodbDatabase}`
        );
    } catch (e) {
        console.error(e);
    }

    fastify.decorate('db', mongoose);

    next();
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    db: Db;
  }
}
```

## Mongoose

```typescript 
import { Document, Schema, Model, model } from "mongoose";

export interface VehicleDocument extends Document {
  year: number;
  name: string;
  createdDate: Date;
}

export interface VehicleModel extends VehicleDocument {}

export const VehicleSchema: Schema = new Schema(
  {
    year: Number,
    name: String,
    createdDate: Date
  },
  { collection: "vehicles" }
);

VehicleSchema.pre<VehicleDocument>("save", async function() {
  this.createdDate = new Date();
});

export const Vehicle: Model<VehicleModel> = model<VehicleModel>(
  "Vehicle",
  VehicleSchema
);
```

```typescript 
import { Model } from "mongoose";
import * as Mongoose from "mongoose";
import { VehicleModel, Vehicle } from "./models/vehicle";

import * as fp from "fastify-plugin";

export interface Models {
  Vehicle: Model<VehicleModel>;
}

export interface Db {
  models: Models;
}

export default fp(async (fastify, opts: { uri: string }, next) => {
  Mongoose.connection.on("connected", () => {
    fastify.log.info({ actor: "MongoDB" }, "connected");
  });

  Mongoose.connection.on("disconnected", () => {
    fastify.log.error({ actor: "MongoDB" }, "disconnected");
  });

  await Mongoose.connect(
    opts.uri,
    {
      useNewUrlParser: true,
      keepAlive: 1
    }
  );

  const models: Models = {
    Vehicle: Vehicle
  };

  fastify.decorate("db", { models });

  next();
});
```

```typescript 
import * as fastify from "fastify";
import * as http from "http";

import { Db } from "../modules/db";
declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse
  > {
    blipp(): void;
    db: Db;
  }
}
```

```typescript 
import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
  server.get("/vehicles/:id", {}, async (request, reply) => {
    try {
      const _id = request.params.id;

      const vehicle = await server.db.models.Vehicle.findOne({
        _id
      });

      if (!vehicle) {
        return reply.send(404);
      }

      return reply.code(200).send(vehicle);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });
  
  server.post("/vehicles", {}, async (request, reply) => {
    try {
      const { Vehicle } = server.db.models;

      const vehicle = await Vehicle.create(request.body);

      return reply.code(201).send(vehicle);
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
  next();
});
```

```typescript 
// index.js
import vehiclesRoutes from "./modules/routes/vehicles";
import db from "./modules/db";

// after server was created
server.register(db, { uri: "mongodb://localhost:27017/vehicles" });
server.register(vehiclesRoutes);
```

