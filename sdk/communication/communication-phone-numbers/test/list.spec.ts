// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Recorder } from "@azure/test-utils-recorder";
import { assert } from "chai";
import { Context } from "mocha";
import { PhoneNumbersClient } from "../src/phoneNumbersClient";
import { matrix } from "./utils/matrix";
import {
  canCreateRecordedClientWithToken,
  createRecordedClient,
  createRecordedClientWithToken
} from "./utils/recordedClient";

matrix([[false]], async function(useAad) {
  describe(`PhoneNumbersClient - lists${useAad ? " [AAD]" : ""}`, function() {
    let recorder: Recorder;
    let client: PhoneNumbersClient;

    before(function(this: Context) {
      if (useAad && !canCreateRecordedClientWithToken()) {
        this.skip();
      }
    });

    beforeEach(function(this: Context) {
      ({ client, recorder } = useAad
        ? createRecordedClientWithToken(this)!
        : createRecordedClient(this));
    });

    afterEach(async function(this: Context) {
      if (!this.currentTest?.isPending()) {
        await recorder.stop();
      }
    });
    
    it("will run infinitely", async function() {
      for await (const purchased of client.listPurchasedPhoneNumbers({ skip: 1, top: 5 })) {
        console.log(purchased.phoneNumber);
        assert.match(purchased.phoneNumber, /\+\d{1}\d{3}\d{3}\d{4}/g);
      }

      assert.isTrue(true);
    }).timeout(0);
  });
});
