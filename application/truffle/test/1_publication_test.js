// const Converter = require("../scripts/converter");
const PublicationContract = artifacts.require("Publication");

contract("Publication", (accounts) => {
  let publication;
  title = "Smart Contract Development with Solidity & Ethereum";
  author = "Kevin Solorio, Randall Kanna & David H. Hoover";
  authorAccount = accounts[0];
  publisher = "O'Relly Media";
  releaseDate = "December 2019";
  isbn = "978-1-492-04526-7";
  description = "Smart Contract Development with Solidity & Ethereum";
  cover = "QmbptcdT1x37m9gvL6ATmX7kYHi9FkbCss2Tpq9DJMtkuK";
  documentHash = "QmbptcdT1x37m9gvL6ATmX7kYHi9FkbCss2Tpq9DJMtkuK";
  const owner = authorAccount;

  describe("Publish A Book", () => {
    beforeEach(async () => {
      publication = await PublicationContract.new(
        title,
        author,
        authorAccount,
        publisher,
        releaseDate,
        isbn,
        cover,
        description,
        documentHash,
        owner
      );
    });

    it("should OK, get publication title", async () => {
      const actualTitle = await publication.title();
      assert.equal(actualTitle, title, "title matched");
    });

    it("should OK, get publication author", async () => {
      const actual = await publication.author();
      assert.equal(actual, author, "author matched");
    });

    it("should OK, get publication publisher", async () => {
      const actual = await publication.publisher();
      assert.equal(actual, publisher, "publisher matched");
    });

    it("should OK, get publication releaseDate", async () => {
      const actual = await publication.releaseDate();
      assert.equal(actual, releaseDate, "releaseDate matched");
    });

    it("should OK, get publication isbn", async () => {
      const actual = await publication.isbn();
      assert.equal(actual, isbn, "isbn matched");
    });

    it("should OK, get publication documentHash", async () => {
      const actual = await publication.getDocument({ from: owner });
      assert.equal(actual, documentHash, "documentHash matched");
    });

    it("should OK, get the owner of publication", async () => {
      const actual = await publication.owner();
      assert.equal(actual, authorAccount, "the owner match with address");
    });

    it("the owner should not account 1", async () => {
      const actual = await publication.owner();
      const guestAddress = accounts[1];
      assert.notEqual(actual, guestAddress, "the owner not matched");
    });
  });

  describe("Customer Request Owner ", async () => {
    const owner = authorAccount;
    const customer = accounts[1];
    const customer_2 = accounts[2];
    const customerPublicKey = (Math.random() + 1).toString(36).substring(7);
    const newHashDocument = documentHash + customerPublicKey;

    before(async () => {
      publication = await PublicationContract.new(
        title,
        author,
        authorAccount,
        publisher,
        releaseDate,
        isbn,
        cover,
        description,
        documentHash,
        authorAccount
      );
    });

    it("Should error, get the empty request", async () => {
      try {
        await publication.getRequest({
          from: owner,
        });
        assert.fail("The transaction should have thrown an error");
      } catch (error) {
        const expectedMessage = "the request is not available";
        assert.include(
          error.message,
          expectedMessage,
          `The error message should contain '${expectedMessage}'`
        );
      }
    });

    it("Should return event Requested", async () => {
      const tx = await publication.requestOwner(customerPublicKey, {
        from: customer,
      });

      const expectedEvent = "Requested";
      const actualEvent = tx.logs[0].event;

      assert.equal(
        actualEvent,
        expectedEvent,
        `the response event is Requested`
      );
    });

    it("Should rejected, the Owner can't make the request", async () => {
      try {
        await publication.requestOwner(customerPublicKey, { from: owner });
        assert.fail("The transaction should have thrown an error");
      } catch (error) {
        const expectedMessage = "the owner not allowed";
        assert.include(
          error.message,
          expectedMessage,
          `The error message should contain '${expectedMessage}'`
        );
      }
    });

    it("Should rejected, customer was requested", async () => {
      try {
        await publication.requestOwner(customerPublicKey, {
          from: customer,
        });
        assert.fail("The transaction should have thrown an error");
      } catch (error) {
        const expectedMessage = "you requested";
        assert.include(
          error.message,
          expectedMessage,
          `The error message should contain '${expectedMessage}'`
        );
      }
    });

    it("Should rejected, the publication has been booked by someone", async () => {
      try {
        await publication.requestOwner(customerPublicKey, {
          from: customer_2,
        });
        assert.fail("The transaction should have thrown an error");
      } catch (error) {
        const expectedMessage = "the publication requested";
        assert.include(
          error.message,
          expectedMessage,
          `The error message should contain '${expectedMessage}'`
        );
      }
    });

    it("Should return hash and customer address, get request", async () => {
      const tx = await publication.getRequest({
        from: owner,
      });

      const customerAddr = tx[0],
        pubKey = tx[1];

      assert.equal(
        customerAddr,
        customer,
        "address response should match with cutomer address"
      );
      assert.isNotNull(pubKey, "publicKey response should exist");
    });

    it("Should OK, accept request", async () => {
      const tx = await publication.acceptRequest(customer, newHashDocument, {
        from: owner,
      });

      const expectedEvent = "RequestAccepted";
      const actualEvent = tx.logs[0].event;

      assert.equal(
        actualEvent,
        expectedEvent,
        `the response event is RequestAccepted`
      );
    });

    it("Should be OK, the customer should be new owner", async () => {
      const newOwner = await publication.owner();
      assert.equal(newOwner, customer, "the customer should be owner");
    });

    it("Should be OK, the new owner (customer) can access document", async () => {
      const actual = await publication.getDocument({ from: customer });
      assert.equal(actual, newHashDocument, "documentHash matched");
    });

    it("Should rejected, the old owner can't access document", async () => {
      try {
        await publication.getDocument({ from: owner });
        assert.fail("The transaction should have thrown an error");
      } catch (error) {
        const expectedMessage = "the guest not allowed";
        assert.include(
          error.message,
          expectedMessage,
          `The error message should contain '${expectedMessage}'`
        );
      }
    });

    it("Should rejected, the request should emty after accepted", async () => {
      try {
        await publication.getRequest({ from: customer });
        assert.fail("The transaction should have thrown an error");
      } catch (error) {
        const expectedMessage = "the request is not available";
        assert.include(
          error.message,
          expectedMessage,
          `The error message should contain '${expectedMessage}'`
        );
      }
    });
  });
});
