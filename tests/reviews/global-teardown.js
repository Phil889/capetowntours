// Global teardown for tour reviews tests
module.exports = async () => {
  console.log('\n🏁 Tearing down Tour Reviews Test Environment...');
  
  // Clean up any resources or connections
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  console.log('✅ Test environment cleanup complete');
};