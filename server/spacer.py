# Adds spaces between the word lists so that the sql will work correctly
# Input file name (Obviously change to the correct file path if need be)
input_file = '/Users/kavanaughfrank/Desktop/School/Sophmore Year/CS3560/fibble-cpp-f23/server/word_lists/nyt_allowed.txt'

# Output file name
output_file = 'spaced_allow.txt'

try:
    # Open the input file for reading
    with open(input_file, 'r') as infile:
        # Read all lines from the input file
        lines = infile.readlines()

    # Open the output file for writing
    with open(output_file, 'w') as outfile:
        # Iterate through the lines and write them to the output file
        for line in lines:
            # Write an empty line after each line
            outfile.write('\n')
            # Write the current line
            outfile.write(line)
            

    print("Empty lines added between lines in the output file.")

except FileNotFoundError:
    print(f"The file '{input_file}' was not found.")
except Exception as e:
    print(f"An error occurred: {str(e)}")