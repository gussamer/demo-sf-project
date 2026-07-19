describe("When I clicked the active checkbox", function() {

  beforeEach(function() {
    spyOn(window, "confirm").and.returnValue(true);
  })

  it("should display a confirmation dialogue if the user is not paid and has 1 rollup.", function() {
    var result = confirmActive("false", "name", 1, true);
    expect(window.confirm).toHaveBeenCalledWith("Are you sure you would like to activate name?");
    expect(result).toBe(true);
  });

  it("should return false if the user is not paid and has 3 rollups.", function() {
    var result = confirmActive("false", "name", 3, true);
    expect(window.confirm).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("should display a notification if the user is paid and has 3 rollups.", function() {
    var result = confirmActive("false", "name", 3, false);
    expect(window.confirm).toHaveBeenCalledWith("Are you sure you would like to activate name?");
    expect(result).toBe(true);
  });

  it("should display a notification if the user is not paid and has 3 rollups while disabling 1.", function() {
    var result = confirmActive("true", "name", 3, true);
    expect(window.confirm).toHaveBeenCalledWith("Are you sure you would like to deactivate name?");
    expect(result).toBe(true);
  })
})

describe("When I attempt to overwrite something", function() {

  beforeEach(function() {
    spyOn(window, "confirm").and.returnValue(true);
  });

  it("should display a confirmation message if checkOverwrite is true", function() {
    var result = confirmOverwrite("true", "name");
    expect(window.confirm).toHaveBeenCalledWith("Are you sure you do not want to overwrite information in the name field?");
    expect(result).toBe(true);
  });

  it("should not display a confirmation message if checkOverwrite is false", function() {
    var result = confirmOverwrite("false", "name");
    expect(window.confirm).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
})