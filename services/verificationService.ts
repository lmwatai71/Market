// Mock Verification Service

export const sendVerificationCode = async (phoneNumber: string): Promise<string> => {
  console.log(`[Mock SMS] Sending code 123456 to ${phoneNumber}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "sent"; 
};

export const verifyVerificationCode = async (phoneNumber: string, code: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, the code is always '123456'
  if (code === "123456") {
    return true;
  }
  return false;
};