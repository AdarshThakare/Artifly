import { motion } from "framer-motion";
import { Card } from "../Card";
import { Input } from "../Input";
import { Button } from "../Button";
import { FileUploader } from "../FileUploader";
import { Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Step3Props {
  direction: "forward" | "backward";
  onPrevious: () => void;
}

export default function Step3Upload({ direction, onPrevious }: Step3Props) {
  return (
    <motion.div
      key="step3"
      custom={direction}
      initial={{ x: direction === "forward" ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? -80 : 80, opacity: 0 }}
      className="absolute w-full"
    >
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-blue-600" /> Upload & Price
        </h2>
        <div className="space-y-4">
          <FileUploader onFilesChange={() => {}} maxFiles={3} />
          <Input label="Price (₹)" type="number" placeholder="Enter price" />
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md">
              Finish
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
