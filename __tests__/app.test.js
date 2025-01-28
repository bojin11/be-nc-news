const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
/* Set up your test imports here */
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("responds with 200 and an array of objects which have required properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toEqual(3);
        body.topics.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/1", () => {
  test("responds with 200 and an array of objects which have required properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
});

describe("GET /api/articles", () => {
  test("responds with 200 and an array of objects which have required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(13);
        body.articles.forEach((element) => {
          expect(element).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/1/comments", () => {
  test("responds with 200 and an array of objects which have required properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(11);
        body.comments.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
});
