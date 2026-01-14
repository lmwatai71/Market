
// Mock Report Service

export const submitReport = async (listingId: string, listingTitle: string, reason: string): Promise<boolean> => {
  // Simulate network request to Admin API
  console.log(`[Report Service] Submitting report for item "${listingTitle}" (ID: ${listingId})`);
  console.log(`[Report Service] Reason: ${reason}`);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success
  return true;
};
