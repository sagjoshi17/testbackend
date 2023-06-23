const deleteTestById = async (req, res) => {
    let id = req.params.id;
    try {
      const element = await testFormation.findById(id).populate({
        path: "sectionData",
        model: "section",
      });
      const session = await mongoose.startSession();
      let subSections = element.sectionData;
      await session.withTransaction(async () => {
        if (subSections) {
          for (let i = 0; i < subSections.length; i++) {
            console.log(subSections[i]._id.toString());
            await section.deleteOne({
              _id: subSections[i]._id.toString(),
            });
          }
        }
        await testFormation.deleteOne({ _id: id });
      });
      session.endSession();
  
      res.status(201).json({ message: "Test was deleted successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };