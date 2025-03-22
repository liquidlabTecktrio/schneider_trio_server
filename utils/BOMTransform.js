 exports.transformBOMData = function transformBOMData(bomData) {
    let result = [];
    let currentCR = null;
  
    bomData.forEach((item) => {
      if (item.Level === "0") {
        // If we encounter a new Level 0 item, push the previous CR (if exists)
        if (currentCR) {
          result.push(currentCR);
        }
        // Create a new CR entry
        currentCR = {
          CR: { ...item },
          parts: [],
        };
      } else if (currentCR) {
        // Add Level > 0 items as parts
        currentCR.parts.push({ ...item });
      }
    });
  
    // Push the last processed CR
    if (currentCR) {
      result.push(currentCR);
    }
  
    return result;
  }
  

  