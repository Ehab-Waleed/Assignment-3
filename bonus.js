var majorityElement = function (nums) {
  nums.sort((a, b) => {
    return a - b;
  });
  const mid = Math.floor(nums.length / 2);
  return nums[mid];
};
console.log(majorityElement([3, 2, 3]));
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2]));
