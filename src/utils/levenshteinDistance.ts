const levenshteinDistance = (word1: string, word2: string): number => {
  const m = word1.length;
  const n = word2.length;
  const editDistanceMatrix: number[][] = []; // Matrix for dynamic programming (memoization)

  for (let i = 0; i <= m; i += 1) {
    editDistanceMatrix[i] = [];
    for (let j = 0; j <= n; j += 1) {
      if (i === 0) {
        editDistanceMatrix[i][j] = j; // Fill the first row with incremental values
      } else if (j === 0) {
        editDistanceMatrix[i][j] = i; // Fill the first column with incremental values
      } else {
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1; // Calculate the cost of substituting characters
        editDistanceMatrix[i][j] = Math.min(
          editDistanceMatrix[i - 1][j - 1] + cost, // Substitution
          editDistanceMatrix[i][j - 1] + 1, // Insertion
          editDistanceMatrix[i - 1][j] + 1, // Deletion
        );
      }
    }
  }

  return editDistanceMatrix[m][n]; // Return the Levenshtein Distance score
};

/**
 * @param givenWord The word wanted to find the closest matches.
 * @param words An array of words against which the similarity will be calculated.
 * @param maximumWordsToSuggest The maximum number of closest words to be returned.
 * @returns An array of closest words based on Levenshtein Distance.
 */
export const getClosestWords = (
  givenWord: string,
  words: string[],
  maximumWordsToSuggest: number,
): string[] => {
  // Calculate the Levenshtein Distance for each word and store it along with the word
  const distances = words.map((word) => ({
    word,
    distance: levenshteinDistance(givenWord, word),
  }));

  // Sort the distances in ascending order
  distances.sort((a, b) => a.distance - b.distance);

  // Return the first {maximumWordsToSuggest} words from the sorted array
  return distances.slice(0, maximumWordsToSuggest).map((item) => item.word);
};
