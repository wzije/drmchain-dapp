const BookContract = artifacts.require("Book");
const BookFactoryContract = artifacts.require("BookFactory");

contract("Book Factory", (accounts) => {
  let factory;
  authorAccount = accounts[0];

  title = "Smart Contract Development with Solidity & Ethereum";
  author = "Kevin Solorio, Randall Kanna & David H. Hoover";
  publisher = "O'Relly Media";
  releaseDate = "December 2019";
  isbn = "978-1-492-04526-7";
  description = "Smart Contract Development with Solidity & Ethereum";
  cover = "QmbptcdT1x37m9gvL6ATmX7kYHi9FkbCss2Tpq9DJMtkuK";
  documentHash = "QmbptcdT1x37m9gvL6ATmX7kYHi9FkbCss2Tpq9DJMtkuK";

  const create = async () => {
    return await factory.createBook(
      title,
      author,
      authorAccount,
      publisher,
      releaseDate,
      isbn,
      cover,
      description,
      documentHash
    );
  };

  it("increment the BookCount", async () => {
    factory = await BookFactoryContract.deployed();
    const oldBookCount = await factory.bookCount();

    await create();

    const newBookCount = await factory.bookCount();

    assert.equal(
      newBookCount - oldBookCount,
      1,
      "new book count should increment 1"
    );
  });

  it("Emit book create event", async () => {
    factory = await BookFactoryContract.deployed();
    const tx = await create();

    const expectedEvent = "BookCreated";
    const actualEvent = tx.logs[0].event;

    assert.equal(actualEvent, expectedEvent, "event should match");
  });
});

contract("Book Factory: books", (accounts) => {
  const owner = accounts[0];

  async function createBookFactory(bookCount, accounts) {
    const factory = await BookFactoryContract.new();
    await addBook(factory, bookCount, accounts);
    return factory;
  }

  async function addBook(factory, count, account) {
    acc = account == undefined ? owner : account;

    title = "Smart Contract Development with Solidity & Ethereum";
    author = "Kevin Solorio, Randall Kanna & David H. Hoover";
    publisher = "O'Relly Media";
    releaseDate = "December 2019";
    isbn = "978-1-492-04526-7";
    description = "Smart Contract Development with Solidity & Ethereum";
    documentHash = "QmbptcdT1x37m9gvL6ATmX7kYHi9FkbCss2Tpq9DJMtkuK";

    for (let i = 0; i < count; i++) {
      await factory.createBook(
        title + i,
        author + i,
        owner,
        publisher + i,
        releaseDate + i,
        isbn + i,
        cover,
        description + i,
        documentHash,
        { from: acc }
      );
    }
  }

  describe("when book collection is empty", () => {
    it("return an empty collection", async () => {
      const factory = await createBookFactory(0, owner);
      const books = await factory.books(10, 0);
      assert.equal(books.length, 0, "collection should be empty");
    });
  });

  describe("varying limits", () => {
    let factory;
    beforeEach(async () => {
      factory = await createBookFactory(30, owner);
    });

    it("return 10 when limit is 10", async () => {
      const books = await factory.books(10, 0);
      assert.equal(books.length, 10, "result size should 10");
    });

    it("return 20 when limit is 20", async () => {
      const books = await factory.books(20, 0);
      assert.equal(books.length, 20, "result size should 20");
    });
  });

  describe("varying offset", () => {
    let factory;
    beforeEach(async () => {
      factory = await createBookFactory(10, owner);
    });

    it("contains the book with appropriate offset", async () => {
      const books = await factory.books(1, 0);
      const book = await BookContract.at(books[0]);
      const title = await book.title();
      assert.ok(await title.includes(0), `${title} did not include the offset`);
    });

    it("contains the book with the appropriate offset", async () => {
      const books = await factory.books(1, 7);
      const book = await BookContract.at(books[0]);
      const title = await book.title();
      assert.ok(await title.includes(7), `${title} did not include the offset`);
    });
  });

  describe("boundary conditions", () => {
    let factory;
    beforeEach(async () => {
      factory = await createBookFactory(10, owner);
    });

    it("raises out of bounds error", async () => {
      try {
        await factory.books(1, 11);
        assert.fail("error was not raised");
      } catch (err) {
        const expected = "offset out of bounds";
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });

    it("adjusts return size to prevent out of bounds error", async () => {
      try {
        const books = await factory.books(10, 5);
        assert.equal(books.length, 5, "collection adjusted");
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });
  });

  describe("access my books", () => {
    it("get my book, should return is mine", async () => {
      try {
        const factory = await createBookFactory(5, owner);
        const books = await factory.myBooks({ from: owner });
        assert.equal(books.length, 5, "collection adjusted");
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });

    it("get my request, should return is mine", async () => {
      try {
        let newOwner = accounts[1];
        const factory = await createBookFactory(1, newOwner);

        const myBooks = await factory.myBooks({ from: newOwner });
        const book = await BookContract.at(myBooks[0]);
        const bookTitle = await book.title();

        // my request as customer perspective
        let customer = accounts[2];
        await book.requestOwner("0x99", { from: customer });
        const myRequests = await factory.myRequests({
          from: customer,
        });
        const myRequest = await BookContract.at(myRequests[0]);
        const myRequestTitle = await myRequest.title();

        assert.equal(bookTitle, myRequestTitle, "should equal");
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });
  });
});
