import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        width: 350,
        position: "relative",
      }}
    >
      <Box
        component="img"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b613640e22bf34bbbee18e0ecf20e976c22f9909"
        alt="Quote icon"
        sx={{
          width: 70,
          height: 46,
          position: "absolute",
          top: -29,
          left: -19,
        }}
      />
      <Typography variant="body1" color="text.secondary" mb={2}>
        “{quote}”
      </Typography>
      <Typography variant="h6" fontWeight="bold" color="primary.dark" mt={2}>
        {author}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        {role}
      </Typography>
    </Paper>
  );
};
export default TestimonialCard;
