describe("When I click the Run Once button", function() {
  var rollupRun;
  var estimateMultipler = .75;

  // beforeEach(function() {
  //   rollupRun = new RollupRun();
  // });

  it("should calculate the duration to be 1 minute.", function() {
    var numRecords = Math.floor(500 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 minute");
  });

  it("should calculate the duration to be 20 minutes.", function() {
    var numRecords = Math.floor(10000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("20 minutes");
    });
  
  it("should calculate the duration to be one hour.", function() {
    var numRecords = Math.floor(30000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 hour");
  });

  it("should calculate the duration to be 6 hours 15 minutes.", function() {
    var numRecords = Math.floor(187500 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("6 hours 15 minutes");
  });

  it("should calculate the duration to be one day.", function() {
    var numRecords = Math.floor(720000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 day");
  });

  it("should calculate the duration to be 4 days 8 hours.", function() {
    var numRecords = Math.floor(3120000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("4 days 8 hours");
  });

  it("should calculate the duration to be one week.", function() {
    var numRecords = Math.floor(5040000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 week");
  });

  it("should calculate the duration to be 2 weeks 5 days.", function() {
    var numRecords = Math.floor(13680000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("2 weeks 5 days");
  });

  it("should calculate the duration to be one month.", function() {
    var numRecords = Math.floor(21600000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 month");
  });

  it("should calculate the duration to be 4 months 3 weeks.", function() {
    var numRecords = Math.floor(101520000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("4 months 3 weeks");
  });

  it("should calculate the duration to be one year.", function() {
    var numRecords = Math.floor(262800000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 year");
  });

  it("should calculate the duration to be 1 year 8 months.", function() {
    var numRecords = Math.floor(435600000 / estimateMultipler);
    expect(RollupRun.calculateDuration(numRecords, 500)).toBe("1 year 8 months");
  });
});
