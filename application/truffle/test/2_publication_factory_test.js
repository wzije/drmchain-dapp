const PublicationContract = artifacts.require("Publication");
const PublicationFactoryContract = artifacts.require("PublicationFactory");

contract("Publication Factory", (accounts) => {
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
    return await factory.createPublication(
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

  it("increment the publicationCount", async () => {
    factory = await PublicationFactoryContract.deployed();
    const oldPublicationCount = await factory.publicationCount();

    await create();

    const newPublicationCount = await factory.publicationCount();

    assert.equal(
      newPublicationCount - oldPublicationCount,
      1,
      "new publication count should increment 1"
    );
  });

  it("Emit publication create event", async () => {
    factory = await PublicationFactoryContract.deployed();
    const tx = await create();

    const expectedEvent = "PublicationCreated";
    const actualEvent = tx.logs[0].event;

    assert.equal(actualEvent, expectedEvent, "event should match");
  });
});

contract("Publication Factory: publications", (accounts) => {
  const owner = accounts[0];

  async function createPublicationFactory(publicationCount, accounts) {
    const factory = await PublicationFactoryContract.new();
    await addPublication(factory, publicationCount, accounts);
    return factory;
  }

  async function addPublication(factory, count, account) {
    acc = account == undefined ? owner : account;

    title = "Smart Contract Development with Solidity & Ethereum";
    author = "Kevin Solorio, Randall Kanna & David H. Hoover";
    publisher = "O'Relly Media";
    releaseDate = "December 2019";
    isbn = "978-1-492-04526-7";
    description = "Smart Contract Development with Solidity & Ethereum";
    documentHash = "QmbptcdT1x37m9gvL6ATmX7kYHi9FkbCss2Tpq9DJMtkuK";

    for (let i = 0; i < count; i++) {
      await factory.createPublication(
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

  describe("when publication collection is empty", () => {
    it("return an empty collection", async () => {
      const factory = await createPublicationFactory(0, owner);
      const publications = await factory.publications(10, 0);
      assert.equal(publications.length, 0, "collection should be empty");
    });
  });

  describe("varying limits", () => {
    let factory;
    beforeEach(async () => {
      factory = await createPublicationFactory(30, owner);
    });

    it("return 10 when limit is 10", async () => {
      const publications = await factory.publications(10, 0);
      assert.equal(publications.length, 10, "result size should 10");
    });

    it("return 20 when limit is 20", async () => {
      const publications = await factory.publications(20, 0);
      assert.equal(publications.length, 20, "result size should 20");
    });
  });

  describe("varying offset", () => {
    let factory;
    beforeEach(async () => {
      factory = await createPublicationFactory(10, owner);
    });

    it("contains the publication with appropriate offset", async () => {
      const publications = await factory.publications(1, 0);
      const publication = await PublicationContract.at(publications[0]);
      const title = await publication.title();
      assert.ok(await title.includes(0), `${title} did not include the offset`);
    });

    it("contains the publication with the appropriate offset", async () => {
      const publications = await factory.publications(1, 7);
      const publication = await PublicationContract.at(publications[0]);
      const title = await publication.title();
      assert.ok(await title.includes(7), `${title} did not include the offset`);
    });
  });

  describe("boundary conditions", () => {
    let factory;
    beforeEach(async () => {
      factory = await createPublicationFactory(10, owner);
    });

    it("raises out of bounds error", async () => {
      try {
        await factory.publications(1, 11);
        assert.fail("error was not raised");
      } catch (err) {
        const expected = "offset out of bounds";
        assert.ok(err.message.includes(expected), `${err.message}`);
      }
    });

    it("adjusts return size to prevent out of bounds error", async () => {
      try {
        const publications = await factory.publications(10, 5);
        assert.equal(publications.length, 5, "collection adjusted");
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });
  });

  describe("access my publications", () => {
    it("get my publication, should return is mine", async () => {
      try {
        const factory = await createPublicationFactory(5, owner);
        const publications = await factory.myPublications();
        assert.equal(publications.length, 5, "collection adjusted");
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });

    it("get my request, should return is mine", async () => {
      try {
        let customer = accounts[1];

        const factory = await createPublicationFactory(1, owner);

        const publications = await factory.publications(1, 0);
        const publication = await PublicationContract.at(publications[0]);
        const publicationTitle = await publication.title();

        await publication.requestOwner("0x99", { from: customer });
        const myPublicationRequests = await factory.myPublicationRequests({
          from: customer,
        });
        const myPublicationRequest = await PublicationContract.at(
          myPublicationRequests[0]
        );

        const myPublicationRequestTitle = await myPublicationRequest.title();

        assert.equal(
          publicationTitle,
          myPublicationRequestTitle,
          "should equal"
        );
      } catch (err) {
        assert.fail("limit and offset exceeded bounds");
      }
    });
  });
});
