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

describe("POST /api/articles/1/comments", () => {
  test("201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "butter_bridge", body: "Great article!" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          author: "butter_bridge",
          body: "Great article!",
        });
      });
  });
  test("400: Responds with an error when missing required fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "butter_bridge" }) // Missing the `body`
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("author and body are required");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should update the votes of the article by the given amount and respond with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 }) // Increment the votes by 1
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: expect.any(Number), // Updated vote count should be a number
          })
        );
      });
  });
  test("should respond with 400 if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not_a_number" }) // Invalid input
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Bad Request: inc_votes must be a number");
      });
  });
  test("should respond with 404 if article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/9999") // Non-existing article_id
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete the comment by the given comment_id and response status code 204", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});

describe("GET /api/users", () => {
  test("responds with 200 and an array of objects which have required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toEqual(4);
        body.users.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/articles?sort_by=created_at", () => {
  test("responds with 200 and an array of objects which have required properties and sorted by treasure_name", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
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

describe("/api/articles?sort_by=created_at&order=desc", () => {
  test("responds with 200 and an array of objects which have required properties and sorted by treasure_name", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
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

describe("/api/articles?topic=mitch", () => {
  test("responds with 200 and an array of objects which have required properties filtered by the given colour", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(12);
        body.articles.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
});
